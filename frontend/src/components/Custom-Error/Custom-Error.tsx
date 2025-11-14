interface IErrorProps {
  errorMsg: string;
}

const Error = ({ errorMsg }: IErrorProps) => {
  return (
    <div className="error-container">
      <p className="error-msg">{errorMsg}</p>
    </div>
  );
};

export default Error;
