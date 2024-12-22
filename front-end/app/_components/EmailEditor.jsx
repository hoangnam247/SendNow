'use client'; // Đảm bảo đây là component phía client

import React, { useState, useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css'; // Import CSS của GrapesJS
import { useToken } from '@/app/contexts/TokenContext'; // Import useToken để lấy token từ context

// Import plugin preset newsletter của GrapesJS
import presetNewsletter from 'grapesjs-preset-newsletter';

// Hàm lấy dữ liệu template email từ API
const getEmailTemplate = async (id, token) => {
  const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}/email-template`, {
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
const saveEmailTemplate = async (id, token, content) => {
  const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: content, // Lưu nội dung vào cột content
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
  const token = useToken(); // Lấy token từ context

  // Lấy template email từ cơ sở dữ liệu khi component được mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getEmailTemplate(templateId, token); // Gọi API lấy nội dung
        const selectedContent = templateData.campaign.content || templateData.email_template_content;
        setEmailTemplate(selectedContent);
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

      // Tải nội dung email template vào editor
      editorInstance.setComponents(emailTemplate);

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

      // Đồng bộ kích thước khi lưu
      editorInstance.Commands.add('save-template', {
        run: async (editor) => {
          let content = editor.getHtml();
          const domParser = new DOMParser();
          const doc = domParser.parseFromString(content, 'text/html');

          // Đồng bộ tất cả ảnh trước khi lưu
          doc.querySelectorAll('img').forEach((img) => {
            const component = editorInstance.getWrapper().find(`#${img.id}`)[0];
            if (component) {
              const { width, height } = component.getStyle();
              if (width) img.setAttribute('width', width.replace('px', ''));
              if (height) img.setAttribute('height', height.replace('px', ''));
            }
          });

          // Chuyển đổi lại nội dung HTML
          content = doc.body.innerHTML;

          // Lưu nội dung
          try {
            await saveEmailTemplate(templateId, token, content);
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
