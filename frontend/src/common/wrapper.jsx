import React from "react";
import { useNavigate } from "react-router-dom";

function withNavigate(Component) {
  function WrappedComponent(props) {
    const [navigateValue, setNavigateValue] = React.useState(null);
    const myNavigate = useNavigate();

    React.useEffect(() => {
      if (navigateValue != null) {
        myNavigate(navigateValue);
      }
    }, [navigateValue]);
    return <Component {...props} navigate={setNavigateValue} />;
  }
  return WrappedComponent;
}

export { withNavigate };
