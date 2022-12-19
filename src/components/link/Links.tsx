import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./link.module.css"

interface LinkProps {
  linkText: string;
  redirectTo: string;
  disabled?: boolean;
  isExternalLink: string;
  isDisabled?: boolean
}

const Links = ({
  linkText,
  redirectTo,
  disabled = false,
  isExternalLink,
  isDisabled
}: LinkProps) => {
  const [isdisabled, setIsDisabled] = React.useState(disabled);

  const OnButtonHandler = (evt) => {
    // handleButtonClick(evt)
    setIsDisabled(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  useEffect(() => {
    setIsDisabled(isDisabled);
  }, [isDisabled])

  let path = redirectTo === undefined ? "/" : redirectTo;

  return (
    <div>
      {/* <Link href="">
            <a href={redirectTo} onClick = {handleOnClick}>{linkText}</a>
        </Link> */}
      <Link href={path}>
        {(isExternalLink && <a target="_blank" className = {isDisabled ? styles.disabledLink : ""}>{linkText}</a>) || (
          <a className = {isDisabled ? styles.disabledLink : ""}>{linkText}</a>
        )}
      </Link>
    </div>
  );
};

export default React.memo(Links);
