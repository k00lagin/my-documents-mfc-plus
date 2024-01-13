// ==UserScript==
// @name        MRS-MFC Plus
// @name:ru-RU  МРС МФЦ Плюс
// @namespace   k00lagin.my-documents-mfc-plus
// @version     0.8.0
// @description Помогает работать с порталом МРС МФЦ. Для использования нового интерфейса используется адрес https://моидокументы.рф/mfc-plus
// @author      k00lagin
// @match       https://mfc-174.ru/store/*
// @match       https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc/*
// @match       https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc-plus
// @match       https://xn--d1achjhdicc8bh4h.xn--p1ai/mfc-plus/*
// @supportURL  https://t.me/mfc_plus_chat/387
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @grant       GM_notification
// @grant       GM_info
// @grant       GM_getResourceURL
// @run-at      document-start
// @homepageURL http://mfc-174.ru/store/scripts/my-documents-mfc-plus
// @updateURL   http://mfc-174.ru/store/scripts/my-documents-mfc-plus.meta.js
// @downloadURL http://mfc-174.ru/store/scripts/my-documents-mfc-plus.user.js
// @icon        http://mfc-174.ru/store/scripts/my-documents-mfc-plus-icon64.png
// @icon64      http://mfc-174.ru/store/scripts/my-documents-mfc-plus-icon64.png
// @resource    favicon http://mfc-174.ru/store/scripts/my-documents-mfc-plus-icon64.png
// @resource    mdi_close https://mfc-174.ru/icons/mdi/close.svg
// @resource    mdi_plus https://mfc-174.ru/icons/mdi/plus.svg
// @resource    mdi_check https://mfc-174.ru/icons/mdi/check.svg
// @resource    mdi_exclamation https://mfc-174.ru/icons/mdi/exclamation.svg
// @resource    vaadin_exclamation https://mfc-174.ru/icons/vaadin/exclamation.svg
// @resource    raphael_connect https://mfc-174.ru/icons/raphael/connect.svg
// @resource    raphael_disconnect https://mfc-174.ru/icons/raphael/disconnect.svg
// @resource    mdi_pencil https://mfc-174.ru/icons/mdi/pencil-outline.svg
// @resource    mdi_trash https://mfc-174.ru/icons/mdi/trash-can-outline.svg
// @resource    mdi_content-save https://mfc-174.ru/icons/mdi/content-save.svg
// @resource    mdi_chevron-down https://mfc-174.ru/icons/mdi/chevron-down.svg
// @resource    mdi_chevron-up https://mfc-174.ru/icons/mdi/chevron-up.svg
// @require     https://mfc-174.ru/store/scripts/3rd-party/xlsx.bundle.js
// @require     https://mfc-174.ru/store/scripts/3rd-party/exceljs.bare.min.js
// @require     https://mfc-174.ru/store/scripts/3rd-party/fuse.js
// ==/UserScript==
