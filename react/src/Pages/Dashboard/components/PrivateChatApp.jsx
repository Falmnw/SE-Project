import React, { useState, useEffect, useRef } from 'react';

export default function PrivateChatApp({ currentUserEmail, token }) {
  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const chatMessagesRef = useRef(null);

  const fetchAllPrivateChats = async () => {
    try {
      const res = await fetch('http://localhost:5051/api/breeding-requests');
      const data = await res.json();

      const acceptedChats = data.filter(req =>
        req.status === 'accepted' &&
        (req.email_from === currentUserEmail || req.owner_email === currentUserEmail)
      );

      const chatsWithMessages = await Promise.all(
        acceptedChats.map(async (chat) => {
          const res = await fetch(`http://localhost:5051/api/chats/private?user1=${chat.email_from}&user2=${chat.owner_email}`);
          const messages = await res.json();
          return { user1: chat.email_from, user2: chat.owner_email, messages };
        })
      );

      setAllChats(chatsWithMessages);
    } catch (err) {
      console.error('Gagal ambil chat:', err);
    }
  };

  useEffect(() => {
    fetchAllPrivateChats();
  }, []);

  const seen = new Set();
  const uniqueChats = allChats.filter((chat) => {
    const otherUser = chat.user1 === currentUserEmail ? chat.user2 : chat.user1;
    if (seen.has(otherUser)) return false;
    seen.add(otherUser);
    return true;
  });

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedUser || !selectedUser.user1 || !selectedUser.user2) return;

    const interval = setInterval(() => {
      fetch(`http://localhost:5051/api/chats/private?user1=${selectedUser.user1}&user2=${selectedUser.user2}`)
        .then(res => res.json())
        .then(newMessages => {
          if (
            newMessages.length !== selectedChat.length ||
            (newMessages.length > 0 &&
              newMessages[newMessages.length - 1].text !== selectedChat[selectedChat.length - 1]?.text)
          ) {
            setSelectedChat(newMessages);
          }
        })
        .catch(err => console.error('Gagal fetch chat:', err));
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedUser, selectedChat]);

  function timeAgo(dateString) {
    const now = new Date();
    const utcDate = new Date(dateString);
    const wibDate = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
    const diff = Math.floor((now - wibDate) / 1000);
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return formatToWIB(dateString);
  }

  function formatToWIB(dateString) {
    const date = new Date(dateString);
    const options = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date) + ' WIB';
  }

  const handleSendMessagePrivate = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await fetch(`http://localhost:5051/api/chats/private/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          from: currentUserEmail,
          to: currentUserEmail === selectedUser.user1 ? selectedUser.user2 : selectedUser.user1,
          text: newMessage,
        }),
      });

      if (!res.ok) throw new Error('Gagal kirim pesan');

      setSelectedChat(prev => [...prev, {
        from: currentUserEmail,
        text: newMessage,
      }]);

      setNewMessage('');
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim pesan');
    }
  };

  // const otherUsers = allChats.map(chat =>
  //   chat.user1 === currentUserEmail ? chat.user2 : chat.user1
  // );

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      width: '320px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif',
      zIndex: 1000
    }}>
      {!selectedUser ? (
        <div style={{ padding: '10px' }}>
          <h4 style={{ marginBottom: '10px' }}>Pilih Pengguna</h4>
          {uniqueChats.length === 0 ? (
            <p style={{ color: '#888' }}>Belum ada chat yang tersedia</p>
          ) : (
            uniqueChats.map((chat, i) => {
              const otherUser = chat.user1 === currentUserEmail ? chat.user2 : chat.user1;
              // const isActive = selectedUser && selectedUser.user1 === chat.user1 && selectedUser.user2 === chat.user2;
              return (
              <div
                key={i}
                onClick={() => {
                    setSelectedUser({ user1: chat.user1, user2: chat.user2 });
                    setSelectedChat(chat.messages);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#f1f1f1',
                  marginBottom: '6px',
                  borderRadius: '6px'
                }}
              >
                💬 {otherUser}
              </div>
              );
            })
          )}
        </div>
      ) : (
        <>
          <div style={{
            padding: '10px',
            backgroundColor: '#0084ff',
            color: 'white',
            fontWeight: 'bold',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {selectedUser.user1 === currentUserEmail ? selectedUser.user2 : selectedUser.user1}
            <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedUser(null); setSelectedChat([]); }}>✕</span>
          </div>

          <div
            ref={chatMessagesRef}
            style={{
              height: '250px',
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9'
            }}
          >
            {selectedChat.length === 0 ? (
              <p>Belum ada pesan</p>
            ) : (
              selectedChat.map((msg, i) => {
                const isSelf = msg.from === currentUserEmail;
                return (
                  <div
                    key={i}
                    style={{ marginBottom: '10px', textAlign: isSelf ? 'right' : 'left' }}
                  >
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: isSelf ? '#0084ff' : '#e4e6eb',
                      color: isSelf ? 'white' : 'black',
                      padding: '8px 12px',
                      borderRadius: '18px',
                      maxWidth: '80%',
                      fontSize: '0.9rem',
                      wordBreak: 'break-word'
                    }}>
                      {msg.text}
                      <div style={{
                        fontSize: '0.7rem',
                        color: isSelf ? '#d0e6ff' : '#555',
                        marginTop: '4px',
                        textAlign: 'right'
                      }}>
                        {msg.time ? `${timeAgo(msg.time)} WIB` : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={handleSendMessagePrivate}
            style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '8px' }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              required
              style={{
                flex: 1,
                padding: '8px 10px',
                border: '1px solid #ccc',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: '8px',
                backgroundColor: '#0084ff',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ➤
            </button>
          </form>
        </>
      )}
    </div>
  );
}
