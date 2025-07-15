// app/chat/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../Lib/fireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

type Chat = {
  id: string;
  userId: string;
  closed: boolean;
  createdAt: string;
};

export default function ChatHome() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
  const fetchChats = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    const results: Chat[] = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Chat, 'id'>; // Tell TS what it is
      return {
        id: doc.id,
        ...data,
      };
    });

    setChats(results);
  };

  onAuthStateChanged(auth, fetchChats);
}, []);


  const handleNewChat = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newChat = await addDoc(collection(db, 'chats'), {
      userId: user.uid,
      createdAt: Timestamp.now(),
      closed: false,
      messages: [],
    });

    router.push(`/chat/${newChat.id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🪐 Your Astrology Chats</h1>

      <button
        onClick={handleNewChat}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-6"
      >
        ➕ Start New Chat
      </button>

      <h2 className="text-xl font-semibold">📁 Previous Chats</h2>
      <ul className="space-y-2 mt-3">
        {chats.filter(c => c.closed).map(chat => (
          <li
            key={chat.id}
            className="bg-white rounded p-3 shadow cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            📅 {/*new Date(chat.createdAt.seconds * 1000).toLocaleString()*/}
          </li>
        ))}
      </ul>
    </div>
  );
}
