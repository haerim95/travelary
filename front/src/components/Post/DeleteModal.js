import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';

const DeleteModal = (props) => {
  const { className } = props;

  const history = useHistory();

  // 파라메터로 전달되는 와일드 카드 변수명으로 전달되는 값을 받아온다.
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const externalCloseBtn = (
    <button
      className='close'
      style={{ position: 'absolute', top: '15px', right: '15px' }}
      onClick={toggle}
    >
      &times;
    </button>
  );

  // 삭제 모달

  const onRemoveClick = () => {
    setModal(true);
  };
  const onCancel = () => {
    setModal(false);
  };
  const onConfirm = () => {
    setModal(false);
    onDeletePost();
  };

  // 게시글 삭제
  const onDeletePost = () => {
    axios
      .delete(`category/post/${id}`)
      .then((res) => {
        console.log('데이터 처리결과:', res.data);
        // alert('삭제완료');
        history.goBack();
      })
      .catch(() => {});
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <Button color='danger' onClick={onRemoveClick}>
        삭제
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        external={externalCloseBtn}
      >
        <ModalHeader>경고창</ModalHeader>
        <ModalBody style={{ textAlign: 'center' }}>
          <b>정말 삭제하시겠습니까?</b>
          <br />
          <br />
          🚨 삭제한 여행 기록은 복구할 수 없습니다
        </ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            // onClick={toggle}
            onClick={onCancel}
          >
            취소
          </Button>{' '}
          <Button
            color='danger'
            // onClick={toggle}
            onClick={onConfirm}
          >
            삭제
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DeleteModal;
