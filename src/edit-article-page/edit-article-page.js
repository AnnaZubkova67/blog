import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchArticle } from '../store/articleSlice';
import FormArticle from '../form-article/form-article';

function EditArticlePage() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { token, user } = useSelector((state) => state.authorization);
  const { id } = useParams();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('authorization'))) {
      navigation('/sign-in');
    } else if (id) {
      dispatch(fetchArticle({ tokenUser: token, slug: id }));
    }
  }, [id]);

  const { fullArticle } = useSelector((state) => state.article);

  useEffect(() => {
    if (Object.keys(fullArticle).length && Object.keys(user).length && fullArticle.author.username !== user.username) {
      navigation(`/articles/${id}`);
    }
  }, [fullArticle, user]);

  // eslint-disable-next-line consistent-return
  const content = () => {
    if (Object.keys(fullArticle).length) {
      return <FormArticle content={fullArticle} />;
    }
  };

  return content();
}

export default EditArticlePage;
