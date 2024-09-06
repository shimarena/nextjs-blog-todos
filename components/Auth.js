import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'universal-cookie';

const cookie = new Cookie();

export default function Auth() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const Login = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 400) {
          throw "authentication failed";
        } else if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        const options = { path: "/" };
        cookie.set("access_token", data.access, options);
      })
      router.push("/main-page");
    } catch (err) {
      alert(err);
    }
  };

  const authUser = async(e) => {
    e.preventDefault();
    if (isLogin) {
      Login();
    } else {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/register/`,
          {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          if (res.status === 400) {
            throw "authentication failed";
          }
        });
        Login();
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
           {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            {isLogin ? "Login" : "Sign up"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={authUser} className="space-y-6">
            <div>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-tl-md rounded-tr-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-bl-md rounded-br-md border-0 pl-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer font-semibold text-white hover:text-indigo-500">
                    Change mode?
                  </span>
                </div>
              </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLogin ? "Login with JWT" : "Create new user"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
  );
}
