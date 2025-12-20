export const keys = {
    forward: false, backward: false, left: false, right: false,
    sprint: false, jump: false, crouch: false
};

export function initInput() {
    const onKeyDown = (e) => {
        if (e.code === 'KeyW') keys.forward = true;
        if (e.code === 'KeyS') keys.backward = true;
        if (e.code === 'KeyA') keys.left = true;
        if (e.code === 'KeyD') keys.right = true;
        if (e.shiftKey) keys.sprint = true;
        if (e.code === 'Space') keys.jump = true;
        if (e.code === 'ControlLeft') keys.crouch = true;
    };

    const onKeyUp = (e) => {
        if (e.code === 'KeyW') keys.forward = false;
        if (e.code === 'KeyS') keys.backward = false;
        if (e.code === 'KeyA') keys.left = false;
        if (e.code === 'KeyD') keys.right = false;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.sprint = false;
        if (e.code === 'ControlLeft') keys.crouch = false;
        if (e.code === 'Space') keys.jump = false;
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}