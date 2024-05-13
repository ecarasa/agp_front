import styles from './styles.module.css';

export const DrawerTitle = ({ children }: any) => {
    if (!children) return null;
    return <h3 className={styles['drawertitle']}>{children}</h3>;
};
