import React, { useEffect } from 'react';
import { Pagination, Alert, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { fetchArticleList } from '../store/articleListSlice';
import { setPagination } from '../store/authorizationSlice';
import Article from '../article/article';

import styles from './lest-articles.module.scss';
import 'antd/dist/antd.css';

function ListArticles() {
  const dispatch = useDispatch();
  const { articleList, articlesCount, error, status } = useSelector((state) => state.articleList);
  const { pagination } = useSelector((state) => state.authorization);

  useEffect(() => {
    dispatch(fetchArticleList(pagination));
  }, [pagination]);

  const errorElement = (
    <div className={styles['list-articles__error']}>
      <Alert
        message="Error"
        description="Something went wrong, it is impossible to get the data :("
        type="error"
        showIcon
      />
    </div>
  );

  const paginationElement = (
    <Pagination
      defaultPageSize={20}
      showSizeChanger={false}
      defaultCurrent={pagination}
      current={pagination}
      total={articlesCount}
      className={styles['list-articles__pagination']}
      onChange={(e) => dispatch(setPagination({ index: e }))}
    />
  );

  return (
    <Spin spinning={status === 'loading'} delay={500} size="large">
      <ul className={styles['list-articles']}>
        {articleList ? articleList.map((elem) => <Article elem={elem} key={Math.random()} />) : null}
        {articleList && !error && status !== 'loading' ? paginationElement : null}
        {error && status !== 'loading' ? errorElement : null}
      </ul>
    </Spin>
  );
}

export default ListArticles;
