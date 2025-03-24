'use client'; // Đảm bảo đây là component phía client

import React, { useState, useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'; // Import CSS của GrapesJS
import { useToken } from '@/app/contexts/TokenContext'; // Import useToken để lấy token từ context
import html2canvas from 'html2canvas';

// Import plugin preset newsletter của GrapesJS
import presetNewsletter from 'grapesjs-preset-newsletter';

// Hàm lấy dữ liệu template email từ API
const getEmailTemplate = async (id, token) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}/email-template`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Gửi token để xác thực
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Lỗi khi gọi API');
  }

  const { data } = await response.json();

  return data;
};


// Hàm lưu template email về cơ sở dữ liệu
const saveEmailTemplate = async (id, token, content ,css_content,json_content) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: content, // Lưu nội dung vào cột content
      css_content: css_content,
      json_content : json_content,

    }),
  });

  if (!response.ok) {
    const errorData = await response.json(); // Nhận lỗi chi tiết từ API
    throw new Error(errorData.message || 'Lỗi khi lưu nội dung email');
  }

  return response.json();
};

const EmailEditor = ({ templateId }) => {
  const [editor, setEditor] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const  { token } = useToken();

  // Lấy template email từ cơ sở dữ liệu khi component được mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getEmailTemplate(templateId, token); // Gọi API lấy nội dung
        const selectedContent = templateData.campaign.content || templateData.email_template_content;
        const cssContent = templateData.campaign.css_content || templateData.email_template_css_content; // Lấy css content
        const jsonContent = templateData.campaign.json_content || templateData.email_template_json_content; // Lấy json content
        setEmailTemplate({
          html: selectedContent,
          css: cssContent,
          json: jsonContent,
        });      
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };

    if (token) {
      fetchTemplate();
    }
  }, [templateId, token]);

        
      
  // Khởi tạo GrapesJS và xử lý kích thước ảnh
  useEffect(() => {
    if (emailTemplate) {
      const editorInstance = grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: 'auto',
        storageManager: false,
        plugins: [presetNewsletter],
        style: `
          body {
            padding-left: 50px;
            padding-right: 50px;
            margin: 0 auto;
            max-width: 800px; /* Đặt giới hạn chiều rộng cho nội dung */
            background-color: #fff; /* Đảm bảo nền trắng cho body */
          }

        `,
      });



      if (emailTemplate.html) {
        editorInstance.setComponents(emailTemplate.html);
      }
      if (emailTemplate.css) {
        editorInstance.setStyle(emailTemplate.css); // Áp dụng CSS
      }
      
      //  // Nếu bạn muốn lưu JSON, có thể sử dụng editorInstance.setComponents(jsonContent) để thiết lập lại các thành phần
      // if (emailTemplate.json) {
      //   editorInstance.setComponents(JSON.parse(emailTemplate.json));
      // }

      // Đặt kích thước mặc định khi thêm ảnh
      editorInstance.on('component:add', (component) => {
        if (component.is('image')) {
          const attributes = component.getAttributes();

          // Nếu không có kích thước trước đó, đặt kích thước mặc định
          if (!attributes.width && !attributes.height) {
            component.addStyle({
              width: '100%', // Đặt chiều rộng mặc định là 100% (không vượt quá khung)
              height: 'auto', // Duy trì tỷ lệ gốc
            });
            component.setAttributes({
              width: '100%', // Đồng bộ với thuộc tính HTML
              height: 'auto',
            });
          }
        }
      });

      const uploadImageToServer = async (file, asset,token) => {
        const formData = new FormData();
        formData.append("image", file);
        

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token để xác thực
            },
            body: formData,
            });
    
            const data = await response.json();
            return data; // Trả về dữ liệu từ server

        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
        }
    };

    function base64ToFile(base64String, filename) {
      let arr = base64String.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
  
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
  
      return new File([u8arr], filename, { type: mime });
  }

  
          // Khi thêm ảnh vào editor
          editorInstance.on('asset:add', async (asset) => {
            if (asset.get('type') === 'image') {
                let src = asset.get('src');
        
                // Kiểm tra nếu ảnh là Base64
                if (src.startsWith('data:image')) {
                    console.log("Ảnh Base64 được thêm vào, tiến hành upload...");
        
                    try {
                        // Chuyển Base64 thành file Blob
                        const file = base64ToFile(src, "uploaded_image.png");
                        
                        // Upload ảnh lên server
                        const response = await uploadImageToServer(file, asset, token);

                        if (response && response.path) {
                         
                          
                            asset.set('src', response.path); // Thay thế Base64 bằng URL thực tế
                            console.log("Ảnh đã được upload thành công:", response.path);
                        } else {
                            console.error("Lỗi upload ảnh nè:", response);
                        }
                    } catch (error) {
                        console.error("Lỗi khi upload ảnh Base64:", error);
                    }
                }
            }
        });
        
        
        

      // Đồng bộ kích thước khi lưu
      editorInstance.Commands.add('save-template', {
        run: async (editor) => {
          let content = editor.getHtml();
          let cssContent = editor.getCss();
          let jsonContent = JSON.stringify(editor.getComponents());
          
          console.log('Toàn bộ CSS trong editor:', cssContent);

          const domParser = new DOMParser();
          const doc = domParser.parseFromString(content, 'text/html');


    
     // Kiểm tra ảnh và cập nhật URL nếu cần
        doc.querySelectorAll('img').forEach((img) => {
            const src = img.getAttribute('src');

            // Nếu ảnh chưa có URL hợp lệ, cảnh báo trước khi lưu
            if (src.startsWith('data:image') || src.startsWith('blob:')) {
                console.warn('Ảnh vẫn ở dạng Base64 hoặc blob, không thể lưu!');
                alert('Một số ảnh chưa upload xong. Vui lòng chờ hoặc thử lại!');
            }
        });

          // Chuyển đổi lại nội dung HTML
          content = doc.body.innerHTML;

          //

          //           // Bước 1: Lấy nội dung HTML & CSS từ GrapesJS
          // const htmlContent = editor.getHtml();
          // const cssContent1 = editor.getCss();

          // // Bước 2: Tạo một `div` tạm thời để render nội dung này
          // const container = document.createElement('div');
          // container.innerHTML = htmlContent;

          // // Áp dụng CSS của GrapesJS vào container
          // const styleElement = document.createElement('style');
          // styleElement.innerHTML = cssContent1;
          // container.appendChild(styleElement);

          // document.body.appendChild(container);

          // // Bước 3: Chụp ảnh với html2canvas
          // html2canvas(container, {
          //   useCORS: true, // Nếu có ảnh từ nguồn khác, giúp tránh lỗi CORS
          //   scale: 2       // Tăng chất lượng ảnh
          // }).then(canvas => {
          //   // Bước 4: Tạo ảnh từ canvas
          //   const imgData = canvas.toDataURL('image/png');

          //   // Tạo thẻ <a> để tải ảnh về
          //   const link = document.createElement('a');
          //   link.href = imgData;
          //   link.download = 'screenshot.png'; // Tên file ảnh khi tải về
          //   document.body.appendChild(link);
          //   link.click();
          //   document.body.removeChild(link);

          //   // Xóa container sau khi chụp xong
          //   document.body.removeChild(container);
          // });

          // Lưu nội dung
          try {
            await saveEmailTemplate(templateId, token, content, cssContent, jsonContent);
            alert('Lưu thành công');
          } catch (error) {
            console.error('Lỗi khi lưu nội dung email:', error);
            alert('Lưu thất bại');
          }
        },
      });

      // Thêm nút Save trên thanh công cụ
      editorInstance.Panels.addButton('options', [
        {
          id: 'save-button',
          className: 'fa fa-floppy-o',
          command: 'save-template',
          attributes: { title: 'Lưu mẫu' },
        },
      ]);

      setEditor(editorInstance);
    }
  }, [emailTemplate]);

  return (
    <div className="flex h-screen flex-col">
      <div id="gjs" className="flex-grow border border-gray-300"></div>
    </div>
  );
};

export default EmailEditor;
