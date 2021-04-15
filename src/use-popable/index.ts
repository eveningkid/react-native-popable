import { RefObject, useMemo, useRef } from 'react';
import type { PopableManager } from './types';

type Ref = RefObject<PopableManager>;

type UsePopableArray = [Ref, PopableManager];

type UsePopableObject = {
  ref: Ref;
} & PopableManager;

type UsePopable = UsePopableObject & UsePopableArray;

/**
 * Imperatively manage the popover.
 *
 * ```jsx
 * const [ref, { show, hide }] = usePopable()
 *
 * return <Popable ref={ref} />
 * ```
 *
 * If you prefer, you can destructure as an object:
 *
 * ```js
 * const { ref, show, hide } = usePopable()
 * ```
 */
export default function usePopable(): UsePopable {
  const ref = useRef<PopableManager>(null);

  const handlers = useMemo(
    () => ({
      show: () => ref.current?.show(),
      hide: () => ref.current?.hide(),
    }),
    []
  );

  const result = ([ref, handlers] as unknown) as UsePopable;
  result.show = handlers.show;
  result.hide = handlers.hide;
  result.ref = ref;

  return result;
}
