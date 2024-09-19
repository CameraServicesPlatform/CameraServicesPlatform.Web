import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [theme, setTheme] = useState(false);
    const [idRoomChat, setIdRoomChat] = useState(null);
    const [showSearchFriends, setShowSearchFriends] = useState(false);
    const [showChatList, setShowChatList] = useState(true);
    const [active, setActive] = useState(0);
    const [creatorDetail, setCreatorDetail] = useState({});
    const [changeSection, setChangeSection] = useState('');
    const [realtime, setRealtime] = useState('');
    const [demo, setDemo] = useState([]);

    const state = {
        theme,
        setTheme,
        idRoomChat,
        setIdRoomChat,
        showSearchFriends,
        setShowSearchFriends,
        showChatList,
        setShowChatList,
        active,
        setActive,
        creatorDetail,
        setCreatorDetail,
        changeSection,
        setChangeSection,
        realtime,
        setRealtime,
        demo,
        setDemo,
    };

    return (
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);
