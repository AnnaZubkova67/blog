import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import FormArticle from '../form-article/form-article';

function EditArticlePage() {
  const navigation = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('authorization'))) {
      navigation('/sign-in');
    }
  }, []);

  const content = {
    title: '',
    description: '',
    body: '',
  };

  return <FormArticle content={content} />;
}

export default EditArticlePage;
