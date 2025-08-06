'use client';

interface AuthPagesLayoutProps {
  children: React.ReactNode;
}

const AuthPagesLayout = (props: AuthPagesLayoutProps) => {
  const { children } = props;

  return (
    <div className="flex h-screen overflow-clip">
      <div className="w-[60%] overflow-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="px-2 w-3/4 h-max">{children}</div>
        </div>
      </div>
      <div className="grow px-6 bg-gradient-to-tr from-blue-800 to-blue-400 flex flex-col justify-center items-center">
        <h1 className="text-white text-4xl font-bold">Funroad</h1>
      </div>
    </div>
  );
};

export default AuthPagesLayout;
