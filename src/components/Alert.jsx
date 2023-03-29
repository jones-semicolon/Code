import { useEffect } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";

export default function Alert(props) {
  useEffect(() => {
    if (props.ariaHidden) {
      setTimeout(() => props.saved(), 3000);
    }
  }, [props.ariaHidden]);
  return (
    <div className="alert" aria-hidden={!props.ariaHidden}>
      <div className="alertTitle">Saved</div>
      <div className="icon">
        <IconCircleCheckFilled />
      </div>
    </div>
  ) 
}
