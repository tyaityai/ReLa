import { useState } from 'react';
import AddButton from '../components/AddButton';
import AddModal from '../components/AddModal';
import PersonalityVisual from '../components/PersonalityVisual';
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
      if (editingBookmark) {
        // 編集モード: 既存のブックマークを更新
        const savedBookmaks = bookmarks.map(b => 
          b.id === bookmark.id ? bookmark : b
        );
        setBookmarks(savedBookmaks);
        saveBookmarks(savedBookmaks);
      } else {
        // 新規追加モード
        const savedBookmaks = [...bookmarks, bookmark];
        setBookmarks(savedBookmaks);
        saveBookmarks(savedBookmaks);
      }

      setEditingBookmark(null);  // ← リセット
      setIsModalOpen(false);
    };

    const handleAddClick = () => {
        console.log('ボタンが押された!');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('このブックマークを削除しますか?')) {
          return;
        }

        // 削除
        const savedBookmaks = bookmarks.filter(b => b.id !== id);
        setBookmarks(savedBookmaks);
        saveBookmarks(savedBookmaks);
    };
        
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

    return (
        <div className='flex w-full justify-center'>
        <div className="grid grid-cols-1 w-full space-y-4 mt-20 mb-20 place-content-center">
            {bookmarks.length === 0 ? (
                <p className="text-gray-500">まだブックマークがありません</p>
            ) : (
            bookmarks.map(bookmark => (
                <div 
                    key={bookmark.id} 
                    className="grid grid-cols-[75%_20%_5%] items-center justify-stretch relative min-h-30 w-[80%] md:w-[68%] mx-auto rounded-lg p-4 shadow-md hover:shadow-lg transition"
                    style={{boxShadow:  "10px 10px 16px #adb1b7 -10px -10px 16px #f5f9ff"}}
                >
                    <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">{bookmark.title}</h3>
                    <a 
                        href={bookmark.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm md:text-base text-blue-400 truncate hover:underline block mb-2 wrap-break-word"
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
                    </div>
                    <div className='place-items-center max-w-100'>
                        <PersonalityVisual url={bookmark.url} size={100}/>
                    </div>
                    <div>
                                            <button
                        onClick={() => {
                            setEditingBookmark(bookmark);
                            setIsModalOpen(true);
                        }}
                        className="absolute top-9 right-2 w-8 h-8 flex items-center justify-center text-gray-500 cursor-pointer hover:text-gray-800 transition"
                    >
                    <span className="material-symbols-rounded"
                        style={{fontSize:"1.2em"}}
                    >edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center cursor-pointer text-red-400 hover:text-red-500 transition"
                    >
                        <span className="material-symbols-rounded" 
                        style={{fontSize:"1.2em"}}
                        >delete</span>                    
                    </button>
                    </div>
                </div>
                ))
            )}
        </div>
        <AddButton onClick={handleAddClick} />
        <AddModal 
          key={editingBookmark?.id ?? (isModalOpen ? 'new' : 'closed')}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          editingBookmark={editingBookmark}
        />
        </div>
    );
}
export default MainPage;