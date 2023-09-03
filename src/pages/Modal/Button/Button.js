import React, { useState } from 'react';

const Button = ({ onClick }) => {
    return (
        <button onClick={onClick}>Open Modal</button>
    );
};

export default Button;