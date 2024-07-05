'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

import { GithubLogo } from './logos/github-logo';
import { FigmaLogo } from './logos/figma-logo';
import classes from './Header.module.css';

type HeaderProps = {
  menu: { name: string; url: string }[];
};

const Header = ({ menu }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const [pathname, setPathname] = useState(window.location.pathname);

  const handleLocationChange = () => {
    setPathname(window.location.pathname);
  };

  useEffect(() => {
    // Listen for changes in the URL
    window.addEventListener('popstate', handleLocationChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div>
          <Link
            className={cl(classes.logoLink, 'ds-focus')}
            href='/'
            aria-label='Designsystem forside'
            onClick={() => setOpen(false)}
            prefetch={false}
          >
            <Image
              className={classes.logo}
              src='/img/logos/ds-positive.svg'
              alt=''
              aria-hidden='true'
              width={275}
              height={30}
            />
          </Link>
        </div>
        <nav>
          <button
            aria-expanded={open}
            aria-label='Meny'
            className={classes.toggle}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open && (
              <XMarkIcon
                fontSize={26}
                color='#1E2B3C'
              />
            )}
            {!open && (
              <MenuHamburgerIcon
                fontSize={26}
                color='#1E2B3C'
              />
            )}
          </button>
          <ul className={cl(classes.menu, { [classes.active]: open })}>
            {menu.map((item, index) => (
              <li
                className={classes.item}
                key={index}
              >
                <Link
                  suppressHydrationWarning
                  href={item.url}
                  onClick={() => setOpen(false)}
                  prefetch={false}
                  className={cl(
                    pathname === item.url ? classes.active : '',
                    classes.link,
                    'ds-paragraph--md',
                    'ds-focus',
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li
              className={cl(classes.item, classes.itemIcon, classes.firstIcon)}
            >
              <Link
                href='https://github.com/digdir/designsystemet'
                target='_blank'
                className={cl(classes.linkIcon, classes.github, 'ds-focus')}
                title='Designsystemets GitHub-repositorium'
              >
                <GithubLogo />
              </Link>
            </li>
            <li className={cl(classes.item, classes.itemIcon)}>
              <Link
                href='https://www.figma.com/@designsystemet'
                target='_blank'
                className={cl(classes.linkIcon, classes.figma, 'ds-focus')}
                title='Designsystemets Figma-prosjekt'
              >
                <FigmaLogo />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };