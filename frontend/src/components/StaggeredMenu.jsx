import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Box, useColorMode } from '@chakra-ui/react';

export const StaggeredMenu = ({ 
  onNavigate,
  position = 'right',
  colors = ['#00ff94'],
  items = [
    { label: 'Home', link: '#', view: 'home' },
    { label: 'Login', link: '#', view: 'login' },
    { label: 'Register', link: '#', view: 'register' }
  ],
  displaySocials = false,
  displayItemNumbering = true,
  menuButtonColor = '#00ff94',
  openMenuButtonColor = '#00ff94',
  changeMenuColorOnOpen = true,
  isFixed = true,
  accentColor = '#00ff94',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const { colorMode } = useColorMode();

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    opening => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const handleItemClick = useCallback((item, event) => {
    event.preventDefault();
    if (item.view && onNavigate) {
      onNavigate(item.view);
      closeMenu();
    }
  }, [onNavigate]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = event => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <Box
      className="sm-scope"
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      overflow="hidden"
      zIndex={40}
      pointerEvents="none"
    >
      <Box
        className="staggered-menu-wrapper"
        position="relative"
        w="100%"
        h="100%"
        style={{ '--sm-accent': accentColor }}
        data-position={position}
        data-open={open || undefined}
      >
        <Box
          ref={preLayersRef}
          className="sm-prelayers"
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          w="clamp(260px, 38vw, 420px)"
          pointerEvents="none"
          zIndex={5}
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <Box
                key={i}
                className="sm-prelayer"
                position="absolute"
                top={0}
                right={0}
                h="100%"
                w="100%"
                style={{ background: c }}
              />
            ));
          })()}
        </Box>

        <Box
          className="staggered-menu-header"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p="2em"
          bg="transparent"
          pointerEvents="none"
          zIndex={20}
        >
          <Box 
            className="sm-logo" 
            display="flex" 
            alignItems="center" 
            userSelect="none" 
            pointerEvents="auto"
            fontSize="2xl"
            fontWeight="bold"
            color={colorMode === 'dark' ? 'white' : 'gray.800'}
          >
            Modern News
          </Box>

          <Box
            ref={toggleBtnRef}
            className="sm-toggle"
            position="relative"
            display="inline-flex"
            alignItems="center"
            gap="0.3rem"
            bg="transparent"
            border="none"
            cursor="pointer"
            fontWeight="medium"
            lineHeight={1}
            overflow="visible"
            pointerEvents="auto"
            color={menuButtonColor}
            as="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            _focus={{ outline: '2px solid', outlineColor: 'whiteAlpha.500', outlineOffset: '4px', borderRadius: '4px' }}
          >
            <Box
              ref={textWrapRef}
              className="sm-toggle-textWrap"
              position="relative"
              display="inline-block"
              h="1em"
              overflow="hidden"
              whiteSpace="nowrap"
              w="var(--sm-toggle-width, auto)"
              minW="var(--sm-toggle-width, auto)"
              mr="0.5em"
              aria-hidden="true"
            >
              <Box 
                ref={textInnerRef} 
                className="sm-toggle-textInner"
                display="flex"
                flexDirection="column"
                lineHeight={1}
              >
                {textLines.map((l, i) => (
                  <Box 
                    className="sm-toggle-line" 
                    display="block" 
                    h="1em" 
                    lineHeight={1} 
                    key={i}
                  >
                    {l}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              ref={iconRef}
              className="sm-icon"
              position="relative"
              w="14px"
              h="14px"
              flexShrink={0}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                ref={plusHRef}
                className="sm-icon-line"
                position="absolute"
                left="50%"
                top="50%"
                w="100%"
                h="2px"
                bg="currentColor"
                borderRadius="2px"
                transform="translate(-50%, -50%)"
              />
              <Box
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v"
                position="absolute"
                left="50%"
                top="50%"
                w="100%"
                h="2px"
                bg="currentColor"
                borderRadius="2px"
                transform="translate(-50%, -50%)"
              />
            </Box>
          </Box>
        </Box>

        <Box
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel"
          position="absolute"
          top={0}
          right={0}
          h="100vh"
          w="clamp(260px, 38vw, 420px)"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
          display="flex"
          flexDirection="column"
          p="6em 2em 2em 2em"
          overflowY="auto"
          zIndex={10}
          backdropFilter="blur(12px)"
          aria-hidden={!open}
          pointerEvents="auto"
        >
          <Box 
            className="sm-panel-inner"
            flex={1}
            display="flex"
            flexDirection="column"
            gap={5}
          >
            <Box
              className="sm-panel-list"
              as="ul"
              listStyle="none"
              m={0}
              p={0}
              display="flex"
              flexDirection="column"
              gap={2}
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <Box 
                    className="sm-panel-itemWrap" 
                    as="li"
                    position="relative"
                    overflow="hidden"
                    lineHeight={1}
                    key={it.label + idx}
                  >
                    <Box
                      className="sm-panel-item"
                      as="button"
                      position="relative"
                      fontWeight="bold"
                      fontSize={{ base: "3rem", md: "4rem" }}
                      cursor="pointer"
                      lineHeight={1}
                      letterSpacing="-2px"
                      textTransform="uppercase"
                      transition="all 0.15s ease"
                      display="inline-block"
                      textDecoration="none"
                      pr=".5em"
                      bg="transparent"
                      border="none"
                      color="inherit"
                      onClick={(e) => handleItemClick(it, e)}
                      aria-label={it.label}
                      data-index={idx + 1}
                      _hover={{ color: 'primary.500' }}
                      _focus={{ outline: '2px solid', outlineColor: 'primary.500' }}
                    >
                      <Box 
                        className="sm-panel-itemLabel"
                        display="inline-block"
                        transformOrigin="50% 100%"
                      >
                        {it.label}
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box 
                  className="sm-panel-itemWrap" 
                  as="li"
                  position="relative"
                  overflow="hidden"
                  lineHeight={1}
                  aria-hidden="true"
                >
                  <Box
                    className="sm-panel-item"
                    as="span"
                    position="relative"
                    fontWeight="bold"
                    fontSize={{ base: "3rem", md: "4rem" }}
                    cursor="pointer"
                    lineHeight={1}
                    letterSpacing="-2px"
                    textTransform="uppercase"
                    transition="all 0.15s ease"
                    display="inline-block"
                    textDecoration="none"
                    pr="1.4em"
                    color="inherit"
                  >
                    <Box 
                      className="sm-panel-itemLabel"
                      display="inline-block"
                      transformOrigin="50% 100%"
                    >
                      No items
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <style>{`
        .sm-scope {
          overflow: hidden !important;
        }
        
        .staggered-menu-wrapper[data-position='left'] .staggered-menu-panel {
          right: auto;
          left: 0;
        }
        
        .staggered-menu-wrapper[data-position='left'] .sm-prelayers {
          right: auto;
          left: 0;
        }
        
        .sm-panel-list[data-numbering] {
          counter-reset: smItem;
        }
        
        .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
          position: absolute;
          top: 0.1em;
          right: 0.2em;
          font-size: 18px;
          font-weight: 400;
          color: var(--sm-accent, #27C614);
          letter-spacing: 0;
          pointer-events: none;
          user-select: none;
          opacity: var(--sm-num-opacity, 0);
        }
        
        @media (max-width: 768px) {
          .staggered-menu-panel {
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          .sm-prelayers {
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default StaggeredMenu;