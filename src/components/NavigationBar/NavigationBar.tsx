import styles from './NavigationBar.module.scss';
import { Dispatch, SetStateAction } from 'react';

export type Category = {
  id: string;
  title: string;
};

type Props = {
  categoryList: Array<Category>;
  activatedIndex: number;
  dispatchIndex: Dispatch<SetStateAction<number>>;
};

export const NavigationBar: React.VFC<Props> = ({
  categoryList,
  activatedIndex,
  dispatchIndex,
}) => {
  const handleClick = (index: number) => {
    dispatchIndex(index);
  };

  return (
    <ul className={styles['category-list']}>
      {categoryList.map((category, index) => (
        <li
          className={`${styles[`category`]} ${
            styles[`${index === activatedIndex ? '-activated' : ''}`]
          }`}
          key={category.id}
          onClick={() => {
            handleClick(index);
          }}
        >
          {category.title}
        </li>
      ))}
    </ul>
  );
};
