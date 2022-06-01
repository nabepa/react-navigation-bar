import styles from './NavigationBar.module.scss';

export type Category = {
  id: string;
  title: string;
};

type Props = {
  categoryList: Array<Category>;
  activatedIndex: number;
  handleClickTab: (index: number) => void;
};

export const NavigationBar: React.VFC<Props> = ({
  categoryList,
  activatedIndex,
  handleClickTab,
}) => {
  return (
    <ul className={styles['category-list']}>
      {categoryList.map((category, index) => (
        <li
          className={`${styles[`category`]} ${
            styles[`${index === activatedIndex ? '-activated' : ''}`]
          }`}
          key={category.id}
          onClick={() => {
            handleClickTab(index);
          }}
        >
          {category.title}
        </li>
      ))}
    </ul>
  );
};
