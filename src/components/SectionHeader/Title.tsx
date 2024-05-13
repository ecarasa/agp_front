import styles from './styles.module.css';

export const Title = ({ children }: any) => {
    if (!children) return null;
    return <h1 className={styles['title']}>{children}</h1>;
};
