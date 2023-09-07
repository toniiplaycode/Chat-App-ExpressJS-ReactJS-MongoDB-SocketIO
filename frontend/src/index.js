import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import ChatProvider from './Context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <ChakraProvider>
        <ChatProvider>  {/* ChatProvider phải nằm trong BrowserRouter thì ChatProvider mới có thể dùng được useNavigate */}
          <App />
        </ChatProvider>
      </ChakraProvider>
    </BrowserRouter>
);
