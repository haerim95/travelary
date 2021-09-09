import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'reactstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';

import {
  ADD_POST_REQUEST,
  UPLOAD_POST_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from 'reducer/post';
import useInput from 'helpers/useInput';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const PostCreate = ({ post }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addPostDone, imagePaths } = useSelector((state) => state.post);

  const { id } = useParams();

  const [postContents, setPostContents] = useState({
    title: '',
    categoryCode: '',
  });

  const onChangePosts = useCallback((e) => {
    const { name, value } = e.target;
    setPostContents({
      ...postContents,
      [name]: value,
    });
    console.log(postContents);
  });

  // 썸네일 이미지 멀터
  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);
  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_POST_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);
  // ///////////////

  // quill 이미지 멀터
  const [content, setContent] = useState('');
  const quillRef = useRef();
  const imageHandler = () => {
    console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener('change', async () => {
      console.log('온체인지');
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어준다.
      const formData = new FormData();
      formData.append('img', file); // formData는 키-밸류 구조
      // 백엔드 multer라우터에 이미지를 보낸다.
      try {
        const result = await axios.post(
          'http://localhost:3003/category/img',
          formData
        );
        console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
        const IMG_URL = result.data.url;

        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기

        // 2. 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range, 'image', IMG_URL);
      } catch (error) {
        console.log('실패했어요ㅠ', error);
      }
    });
  };
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    };
  }, []);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
  ];

  //
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!postContents.title || !postContents.title.trim()) {
        return alert('타이틀을 작성하세요');
      }
      const formData = new FormData();
      imagePaths.forEach((p) => {
        formData.append('image', p);
      });
      formData.append('title', postContents.title);
      // formData.append('categoryCode', postContents.categoryCode);

      formData.append('content', content);
      return dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
        categoryId: id,
      });
    },
    [postContents.title, content, imagePaths]
  );

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  useEffect(() => {
    // 카테고리 추가가 성공하면 인풋창 날리기..아니지 링크 이동?
    if (addPostDone) {
      alert('포스트가 작성되었습니다!');
      history.push(`/admin/categories/${id}`);
    }
  }, [addPostDone]);

  return (
    <div className='pb-8 pt-2 pt-md-7'>
      <Container className='postCreateWrap'>
        <Form encType='multipart/form-data' onSubmit={onSubmit}>
          <dl>
            <dt>Category Name</dt>
            <dd className='mt-2'></dd>
          </dl>
          <dl>
            <dt> * Title : </dt>
            <dd className='mt-2'>
              <input
                type='text'
                className='form-control'
                placeholder='제목을 입력해주세요'
                onChange={onChangePosts}
                value={postContents.title}
                name='title'
                autoComplete='off'
              />
            </dd>
          </dl>
          <dl className='mb-4'>
            <dt>게시글 작성</dt>
            <dd className='mt-2'>
              <div>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  placeholder='어떤 여행을 하셨나요?'
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                />
              </div>
            </dd>
          </dl>
          <dl>
            <dt>
              대표 이미지
              <br />
              (섬네일 이미지)
            </dt>
            <dd className='mt-2'>
              <div className='custom-file'>
                <input
                  type='file'
                  className='custom-file-input'
                  id='customFileLang'
                  lang='en'
                  name='image'
                  onChange={onChangeImages}
                />
                <label
                  className='custom-file-label inputStyle'
                  for='customFileLang'
                  onClick={onClickImageUpload}
                >
                  대표 섬네일 이미지를 선택해주세요
                </label>
              </div>
              <div className='imageThumbnail mt-3'>
                {imagePaths.map((v, i) => (
                  <div key={v} style={{ display: 'inline-block' }}>
                    <img
                      src={`http://localhost:3003/${v}`}
                      style={{ width: '120px', height: '120px' }}
                      alt={v}
                    />
                    <div className='removeBtnWrap'>
                      <Button onClick={onRemoveImage(i)}>X</Button>
                    </div>
                  </div>
                ))}
              </div>
            </dd>
          </dl>
          {/* <dl>
            <dt>공유 카테고리</dt>
            <dd className='mt-2'>
              <select
                class='form-control'
                name='categoryCode'
                onChange={onChangePosts}
              >
                <option selected value='0'>
                  공유안함
                </option>
                <option value='1'>공유함</option>
              </select>
            </dd>
          </dl> */}
          <div className='mt-8' style={{ textAlign: 'center' }}>
            <button type='submit' class='btn btn-primary'>
              Submit
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default PostCreate;
