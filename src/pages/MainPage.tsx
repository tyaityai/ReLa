import { useState } from 'react';
import AddButton from '../components/AddButton';
import AddModal from '../components/AddModal';
import type { Bookmark } from '../types/bookmarks';
import { getBookmarks, saveBookmarks } from '../utils/localStorage';

function MainPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
        return getBookmarks();
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
  
    const handleSave = (bookmark: Bookmark) => {
        const newBookmarks = [...bookmarks, bookmark];
        setBookmarks(newBookmarks);
        saveBookmarks(newBookmarks);
        setIsModalOpen(false);
    };

    const handleAddClick = () => {
        console.log('ボタンが押された!');
        setIsModalOpen(true);
    };

    return (
        <div className='flex w-full justify-center'>
        <div className="grid grid-cols-1 w-full space-y-4 mt-20 mb-20 place-content-center">
            {bookmarks.length === 0 ? (
                <p className="text-gray-500">まだブックマークがありません</p>
            ) : (
            bookmarks.map(bookmark => (
                <div 
                    key={bookmark.id} 
                    className="w-[80%] md:w-[68%] mx-auto rounded-lg p-4 shadow-md hover:shadow-lg transition"
                    style={{boxShadow:  "10px 10px 16px #adb1b7 -10px -10px 16px #f5f9ff"}}                >
                    <h3 className="text-lg md:text-xl font-bold mb-2">{bookmark.title}</h3>
                    <a 
                        href={bookmark.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm md:text-base text-blue-400 hover:underline block mb-2 wrap-break-word"
                    >
                        {bookmark.url}
                    </a>
                    {bookmark.tags.length > 0 && bookmark.tags[0]!=="" &&(
                        <div className="flex gap-2 mt-2 overflow-auto">
                            {bookmark.tags.map((tag, index) => (
                            <span 
                                key={index}
                                className="px-2 py-1 bg-gray-200 rounded text-sm font-medium"
                            >
                                {tag}
                            </span>
                            ))}
                        </div>
                    )}
                    {bookmark.memo && (
                        <p className="text-gray-600 text-xs mt-2">{bookmark.memo}</p>
                    )}
                    {/* {bookmark.savedAt && (
                        <p className="text-gray-600 text-xs mt-2">{bookmark.savedAt.toLocaleDateString("ja-JP")}</p>
                    )} */}
                </div>
                ))
            )}
        </div>

        <AddButton onClick={handleAddClick} />
        <AddModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
        />
        </div>
    );
}
export default MainPage;