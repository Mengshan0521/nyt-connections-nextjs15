'use client';

interface TagProps {
  text: string;
}

const Tag = ({ text }: TagProps) => {
  return (
    <span className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">
      {text.split(" ").join("-")}
    </span>
  );
};

export default Tag;
