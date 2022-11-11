import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormArticle from '../form-article/form-article';

function EditArticlePage() {
  const navigation = useNavigate();
  const { authorization } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (!authorization) {
      navigation('/sign-in');
    }
  }, [authorization]);

  const content = {
    title: '',
    description: '',
    body: '',
  };

  return <FormArticle content={content} />;
}

export default EditArticlePage;
