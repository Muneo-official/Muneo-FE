'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { type AnchorHTMLAttributes, forwardRef } from 'react';

type TransitionLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { viewTransition?: boolean };

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ viewTransition, onClick, href, ...props }, ref) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (
        !viewTransition ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        props.target === '_blank' ||
        props.download !== undefined ||
        !('startViewTransition' in document)
      ) {
        return;
      }
      e.preventDefault();
      document.startViewTransition(() => {
        router.push(href as string);
      });
    };

    return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
  }
);

TransitionLink.displayName = 'TransitionLink';
