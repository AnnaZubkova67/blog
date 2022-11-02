import React, { useEffect } from 'react';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { fetchArticleList, setPagination } from '../store/articleListSlice';
import ArticlePreview from '../article-preview/article-preview';

import styles from './lest-articles.module.scss';
import 'antd/dist/antd.css';

function ListArticles() {
  const dispatch = useDispatch();
  const { articleList, articlesCount, pagination } = useSelector((state) => state.articleList);

  useEffect(() => {
    dispatch(fetchArticleList(pagination));
  }, [pagination]);

  return (
    <>
      <ul className={styles.list}>
        {articleList ? articleList.map((elem) => <ArticlePreview elem={elem} key={Math.random()} />) : null}
      </ul>
      <Pagination
        defaultPageSize={20}
        showSizeChanger={false}
        defaultCurrent={pagination}
        current={pagination}
        total={articlesCount}
        className={styles.list__pagination}
        onChange={(e) => dispatch(setPagination({ index: e }))}
      />
    </>
  );
}

export default ListArticles;
