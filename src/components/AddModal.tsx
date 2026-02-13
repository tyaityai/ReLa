import { useState } from 'react';
import type { Bookmark } from '../types/bookmarks';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
}

function AddModal({ isOpen, onClose, onSave }: AddModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [tags, setTags] = useState('');
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    const newBookmark = {
      id: crypto.randomUUID(),
      url: url,
      title: title,
      tags: tags.split(',').map(tag => tag.trim()),
      memo: memo,
      savedAt: new Date(),
      personalityScore: 0
    };
    
    onSave(newBookmark);
    
    // 入力欄をリセット
    setUrl('');
    setTitle('');
    setTags('');
    setMemo('');
    setShowDetails(false);
  };

  if (!isOpen) return null;  // モーダルが閉じているときは何も表示しない

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">ブックマークを追加</h2>
        
        {/* URL入力 */}
        <input 
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="inputForm"
        />
        
        {/* タイトル入力 */}
        <input 
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="inputForm"
        />
        
        {/* 詳細を追加ボタン */}
        {!showDetails && (
          <button 
            onClick={() => setShowDetails(true)}
            className="text-blue-500 mb-3 cursor-pointer"
          >
            + 詳細を追加
          </button>
        )}
        
        {/* 詳細入力欄(展開時のみ表示) */}
        {showDetails && (
          <div>
            <input 
              type="text"
              placeholder="タグ (カンマ区切り)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="inputForm"
            />
            <textarea 
              placeholder="メモ"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="inputForm"
              rows={3}
            />
          </div>
        )}
        
        {/* ボタン */}
        <div className="flex gap-3 justify-end font-medium">
          <button 
            onClick={() => {
              onClose();
              setShowDetails(false);
            }}
            className="px-4 py-2 border-2 border-gray-700 hover:border-gray-900 rounded-lg text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            キャンセル
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 cursor-pointer"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddModal;