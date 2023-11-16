# App 

> https://flatdraw.com/


## 开发记录

-   layout.tsx -----> `src\pages\_app.tsx` 和 `src\pages\_document.tsx`

    -   [x] ModalContextProvider
    -   [x] LoadingOverlay
    -   [x] RouterTransition
        -   简单模拟了一个路由变化的过程（不完美）
        -   https://nextjs.org/docs/app/api-reference/functions/use-router
    -   [x] Notifications

-   page.tsx -----> `src\layouts\AppLayout.tsx`

    -   [x] Overlay.OverlayMenu
    -   [x] Overlay.OverlayNavbar
    -   [x] Overlay.OverlaySidebar
    -   [x] Overlay.OverlayZoom
    -   [x] Canvas
    -   [x] CanvasEventListeners

-   代码都抄错的地方

    -   [x] 绘制线条有问题
    -   [x] 包围盒没有展示出来
    -   [x] 包围盒zoom
    -   [x] `layer.backward` 和 `layer.forward`

-   其他问题

    -   [ ] 控制台报错 `ModalContextProvider` , `ModalsProvider`
    -   [ ] 在`_app.tsx` 中 `<Component {...pageProps} />` 没有找到是否需要调整
    -   [ ] "use client" 处理不好服务端组件的这块
