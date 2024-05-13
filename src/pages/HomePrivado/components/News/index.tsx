import NewsBox from './NewsBox';
import NewsDetail from './NewsDetail';
import useNews from '../../hooks/useNews';

function NewsIndex() {
    const { setSelectedItem, selectedItem, ...props } = useNews();
    return (
        <>
            {selectedItem ? (
                <NewsDetail
                    selectedItem={selectedItem}
                    onBackButton={() => setSelectedItem(null)}
                />
            ) : (
                <NewsBox {...props} setSelectedItem={setSelectedItem} />
            )}
        </>
    );
}

export default NewsIndex;
