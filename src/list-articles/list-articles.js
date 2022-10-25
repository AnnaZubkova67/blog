import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { fetchArticleList } from '../store/articleListSlice';
import ArticlePreview from '../article-preview/article-preview';

import styles from './lest-articles.module.scss';
import 'antd/dist/antd.css';

function ListArticles() {
  const dispatch = useDispatch();
  const { articleList, articlesCount } = useSelector((state) => state.articleList);
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    dispatch(fetchArticleList(pagination));
  }, [pagination]);

  return (
    <>
      <ul className={styles.list}>
        {articleList
          ? articleList.map((elem) => {
              const { author, title, description, slug, tagList, createdAt } = elem;
              return (
                <ArticlePreview
                  author={author}
                  title={title}
                  description={description}
                  slug={slug}
                  tagList={tagList}
                  createdAt={createdAt}
                  key={Math.random()}
                />
              );
            })
          : null}
      </ul>
      <Pagination
        defaultPageSize={20}
        showSizeChanger={false}
        defaultCurrent={pagination}
        current={pagination}
        total={articlesCount}
        className={styles.list__pagination}
        onChange={(e) => setPagination(e)}
      />
    </>
  );
}

export default ListArticles;
