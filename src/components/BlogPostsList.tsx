'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '@/models/Post';
import Tag from '@/components/Tag';
import { formatDateWithIntl } from '@/components/util/DateUtils';
import { format, parse } from 'date-fns';

interface BlogPostsListProps {
  posts: Post[];
  locale: string;
}

const BlogPostsList: React.FC<BlogPostsListProps> = ({ posts, locale }) => {
  return (
    <div className="space-y-8">
      {posts?.map((post: Post) => (
        <div key={post.post_date} className="bg-white rounded-lg p-6 shadow-sm border">
          {/* 文章标题 */}
          <h3 className="text-lg font-semibold mb-2">
            <Link
              href={`/blog/NYT-Connections-Hint-${format(
                parse(post.post_date, 'yyyy-MM-dd', new Date()),
                'MMMM-dd-yyyy'
              )}`}
              prefetch={true}
              className="text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors"
              aria-labelledby={`NYT Connections Hint ${formatDateWithIntl(
                parse(post.post_date, 'yyyy-MM-dd', new Date()),
                locale
              )}`}
            >
              <span>{`NYT Connections Hint ${formatDateWithIntl(
                parse(post.post_date, 'yyyy-MM-dd', new Date()),
                locale
              )}`}</span>
            </Link>
          </h3>

          {/* 日期 */}
          <div className="text-sm text-gray-500 mb-3">{post.post_date}</div>

          {/* 单词标签（使用粉色样式，与 GameHintsSection 一致） */}
          {post.words && post.words.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.words.slice(0, 16).map((wordObj, index) => (
                <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                  {wordObj.word}
                </span>
              ))}
            </div>
          )}

          {/* 描述 */}
          <p className="text-gray-600 text-sm mb-4">
            {post.description && post.description.length > 149
              ? `${post.description.substring(0, 149)}...`
              : post.description}
          </p>

          
        </div>
      ))}
    </div>
  );
};

export default BlogPostsList;
