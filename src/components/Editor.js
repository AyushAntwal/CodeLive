import codemirror from 'codemirror'
import React, { useEffect, useRef } from 'react'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/theme/ayu-dark.css'
import ACTION from '../Action'



function Editor({socketRef, roomID,onCodeChange}) {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      
        editorRef.current = codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: {name : 'javascript' , json: true },
        lineNumbers: true,
        theme: 'ayu-dark',
        autoCloseTags: true,
        autoCloseBrackets: true,
      });

      // Pass code 

      editorRef.current.on('change', (instance , changes) => {
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue') {
          if(socketRef.current){
            socketRef.current.emit(
              ACTION.CODE_CHANGE, {
              roomID, code,
            });
          } else {
            console.log('socket error 1 ');
          }
        }
      });

    }
    init();
  },[])

  useEffect( () => {

    if(socketRef.current)
    {
      socketRef.current.on(ACTION.CODE_CHANGE, ({code}) => {
        console.log('receving' , code);
        if(code !== null) {
          editorRef.current.setValue(code);
        }
      })
    } else {
      console.log('socket error 2');
    }

    return () =>{
      socketRef.current.off(ACTION.CODE_CHANGE);
    }
  },[socketRef.current])

  return (
    <textarea id='realtimeEditor'></textarea>
  )
}

export default Editor