import React, { useState, useEffect } from "react";
import "../styles.css";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AlertComponent({ message }) {

  return (
    <div>
      <Alert severity={"warning"} sx={{ width: '100%', }}>
        {message}
      </Alert>
    </div>
  );
}

export default AlertComponent;