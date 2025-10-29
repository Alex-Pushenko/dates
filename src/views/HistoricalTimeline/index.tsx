import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import gsap from 'gsap';
import styles from './index.module.scss';
import { yearData } from '../../shared/data';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

interface MobileYearsPaginationProps {
    totalYears: number;
    activeIndex: number;
    onYearClick: (index: number) => void;
}

const MobileYearsPagination: React.FC<MobileYearsPaginationProps> = ({
                                                                         totalYears,
                                                                         activeIndex,
                                                                         onYearClick
                                                                     }) => {
    return (
        <div className={styles.mobileYearsPagination}>
            {Array.from({ length: totalYears }).map((_, index) => (
                <div
                    key={index}
                    className={`${styles.yearPaginationDot} ${
                        index === activeIndex ? styles.active : ''
                    }`}
                    onClick={() => onYearClick(index)}
                />
            ))}
        </div>
    );
};

const HistoricalTimeline: React.FC = () => {
    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [activeThemeIndex, setActiveThemeIndex] = useState(0);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [hoveredThemeIndex, setHoveredThemeIndex] = useState<number | null>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const activeDotRef = useRef<HTMLDivElement>(null);
    const hoverNumbersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const startYearRef = useRef<HTMLSpanElement>(null);
    const endYearRef = useRef<HTMLSpanElement>(null);
    const mobileStartYearRef = useRef<HTMLSpanElement>(null);
    const mobileEndYearRef = useRef<HTMLSpanElement>(null);
    const swiperRef = useRef<SwiperRef>(null);

    const isMobile = useIsMobile();

    const currentYear = yearData[activeYearIndex] || yearData[0];
    const currentTheme = currentYear.themes[activeThemeIndex] || currentYear.themes[0];

    useEffect(() => {
        setActiveThemeIndex(0);
    }, [activeYearIndex]);

    useEffect(() => {
        if (!isMobile && circleRef.current && activeDotRef.current) {
            const targetRotation = -activeThemeIndex * 60;
            gsap.to(circleRef.current, {
                rotation: targetRotation,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(activeDotRef.current, {
                rotation: -targetRotation,
                duration: 0.6,
                ease: 'power2.out'
            });

            hoverNumbersRef.current.forEach((hoverNumber) => {
                if (hoverNumber) {
                    gsap.to(hoverNumber, {
                        rotation: -targetRotation,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            });
        }
    }, [activeThemeIndex, isMobile]);

    useEffect(() => {
        if (!isMobile && startYearRef.current && endYearRef.current) {
            const prevYear = yearData[activeYearIndex - 1] || yearData[yearData.length - 1];
            const fromStart = prevYear.yearStart;
            const toStart = currentYear.yearStart;
            const fromEnd = prevYear.yearEnd;
            const toEnd = currentYear.yearEnd;

            gsap.to({}, {
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: function () {
                    if (startYearRef.current && endYearRef.current) {
                        const progress = this.progress();
                        const startValue = Math.round(fromStart + (toStart - fromStart) * progress);
                        const endValue = Math.round(fromEnd + (toEnd - fromEnd) * progress);
                        startYearRef.current.innerText = startValue.toString();
                        endYearRef.current.innerText = endValue.toString();
                    }
                }
            });
        }
    }, [activeYearIndex, isMobile]);

    useEffect(() => {
        if (isMobile && mobileStartYearRef.current && mobileEndYearRef.current) {
            const prevYear = yearData[activeYearIndex - 1] || yearData[yearData.length - 1];
            const fromStart = prevYear.yearStart;
            const toStart = currentYear.yearStart;
            const fromEnd = prevYear.yearEnd;
            const toEnd = currentYear.yearEnd;

            gsap.to({}, {
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: function () {
                    if (mobileStartYearRef.current && mobileEndYearRef.current) {
                        const progress = this.progress();
                        const startValue = Math.round(fromStart + (toStart - fromStart) * progress);
                        const endValue = Math.round(fromEnd + (toEnd - fromEnd) * progress);
                        mobileStartYearRef.current.innerText = startValue.toString();
                        mobileEndYearRef.current.innerText = endValue.toString();
                    }
                }
            });
        }
    }, [activeYearIndex, isMobile]);

    const handlePrevYear = () => {
        setActiveYearIndex(prev => (prev > 0 ? prev - 1 : yearData.length - 1));
    };

    const handleNextYear = () => {
        setActiveYearIndex(prev => (prev < yearData.length - 1 ? prev + 1 : 0));
    };

    const handleYearClick = (index: number) => {
        setActiveYearIndex(index);
    };

    const handleThemeClick = (index: number) => {
        setActiveThemeIndex(index);
    };

    const handleThemeHover = (index: number) => {
        setHoveredThemeIndex(index);
    };

    const handleThemeLeave = () => {
        setHoveredThemeIndex(null);
    };

    const setHoverNumberRef = (index: number) => (el: HTMLSpanElement | null) => {
        hoverNumbersRef.current[index] = el;
    };

    const renderDots = () => {
        if (isMobile) return null;

        return currentYear.themes.map((theme, index) => {
            const positions = [
                { hour: 1, angle: 30 },
                { hour: 3, angle: 90 },
                { hour: 5, angle: 150 },
                { hour: 7, angle: 210 },
                { hour: 9, angle: 270 },
                { hour: 11, angle: 330 }
            ];

            const position = positions[index] || positions[0];
            const angleInRadians = (position.angle * Math.PI) / 180;
            const radius = 180;
            const x = radius * Math.sin(angleInRadians);
            const y = -radius * Math.cos(angleInRadians);

            const isActive = index === activeThemeIndex;

            return (
                <div
                    key={index}
                    className={`${styles.dot} ${isActive ? styles.active : ''}`}
                    onClick={() => handleThemeClick(index)}
                    onMouseEnter={() => handleThemeHover(index)}
                    onMouseLeave={handleThemeLeave}
                    style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        zIndex: 200
                    }}
                >
                    {isActive && (
                        <div
                            ref={activeDotRef}
                            className={styles.dotNumberContainer}
                        >
                            <span className={styles.dotNumber}>{index + 1}</span>
                        </div>
                    )}

                    {!isActive && (
                        <span
                            ref={setHoverNumberRef(index)}
                            className={styles.hoverNumber}
                        >
                            {index + 1}
                        </span>
                    )}
                </div>
            );
        });
    };

    const renderActiveThemeTooltip = () => {
        if (isMobile) return null;

        const activePosition = {hour: 1, angle: 30};
        const angleInRadians = (activePosition.angle * Math.PI) / 180;
        const radius = 180;
        const x = radius * Math.sin(angleInRadians);
        const y = -radius * Math.cos(angleInRadians);

        return (
            <div
                className={`${styles.themeTooltip} ${styles.activeTooltip}`}
                style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                }}
            >
                <span className={styles.tooltipText}>{currentTheme.name}</span>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Исторические даты</h1>
            <div className={styles.centerLine}></div>


            {!isMobile && (
                <div className={styles.circleWrapper}>
                    <div className={styles.horizontalLine}></div>
                    <div ref={circleRef} className={styles.rotatingGroup}>
                        <div className={styles.circle}></div>
                        {renderDots()}
                    </div>

                    {renderActiveThemeTooltip()}

                    <div className={styles.years}>
                        <span ref={startYearRef} className={`${styles.year} ${styles.yearStart}`}>
                            {currentYear.yearStart}
                        </span>
                        <span ref={endYearRef} className={`${styles.year} ${styles.yearEnd}`}>
                            {currentYear.yearEnd}
                        </span>
                    </div>
                </div>
            )}

            {isMobile && (
                <div className={styles.mobileYearsOnly}>
                    <span ref={mobileStartYearRef} className={`${styles.year} ${styles.yearStart}`}>
                        {currentYear.yearStart}
                    </span>
                    <span ref={mobileEndYearRef} className={`${styles.year} ${styles.yearEnd}`}>
                        {currentYear.yearEnd}
                    </span>
                </div>
            )}

            <section className={styles.swiperContainer}>
                {isMobile && (
                    <div className={styles.mobileThemeHeader}>
                        <h2 className={styles.mobileThemeTitle}>{currentTheme.name}</h2>
                        <div className={styles.themeDivider}></div>
                    </div>
                )}

                <div className={styles.swiperButtons}>
                    {!isMobile && (
                        <button
                            className={`${styles.swiper_btn} ${styles.btn_prev}`}
                            onClick={() => {
                                swiperRef.current?.swiper.slidePrev();
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 6 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L1.25537 4.74463L5 8.48926" stroke="#4a90e2"/>
                            </svg>
                        </button>
                    )}

                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        spaceBetween={isMobile ? 8 : 20}
                        slidesPerView={3}
                        // loop={isMobile}
                        simulateTouch={true}
                        watchSlidesProgress={false}
                        onSlideChange={(swiper: any) => {
                            setActiveSlideIndex(swiper.realIndex);
                            const prevBtn = document.querySelector(`.${styles.btn_prev}`) as HTMLElement;
                            const nextBtn = document.querySelector(`.${styles.btn_next}`) as HTMLElement;

                            if (prevBtn) {
                                prevBtn.style.opacity = swiper.isBeginning ? '0' : '1';
                            }
                            if (nextBtn) {
                                nextBtn.style.opacity = swiper.isEnd ? '0' : '1';
                            }
                        }}
                        breakpoints={{
                            320: {slidesPerView: 2},
                            768: {slidesPerView: 2},
                            1024: {slidesPerView: 3}
                        }}
                        className={styles.swiperWrapper}
                    >
                        {currentTheme.events.map((event, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={styles.eventCard}>
                                    <h3 className={styles.eventYear}>{event.year}</h3>
                                    <p className={styles.eventTitle}>{event.title}</p>
                                    <p className={styles.eventDesc}>{event.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {!isMobile && (
                        <button
                            className={`${styles.swiper_btn} ${styles.btn_next}`}
                            onClick={() => {
                                swiperRef.current?.swiper.slideNext();
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 6 9" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 8L4.74463 4.25537L1 0.510737" stroke="#4a90e2"/>
                            </svg>
                        </button>
                    )}
                </div>
            </section>

            {!isMobile && (
                <div className={styles.navigationBlock}>
                    <div className={styles.counter}>
                        {activeYearIndex + 1}/{yearData.length}
                    </div>
                    <div className={styles.counter_buttons}>
                        <button onClick={handlePrevYear} className={styles.arrowBtn}>&lt;</button>
                        <button onClick={handleNextYear} className={styles.arrowBtn}>&gt;</button>
                    </div>
                </div>
            )}

            {isMobile && (
                <div className={styles.navigationBlockMobile}>
                    <div className={styles.navLeftSection}>
                        <div className={styles.counter}>
                            {activeYearIndex + 1}/{yearData.length}
                        </div>
                        <div className={styles.mobileNavButtons}>
                            <button onClick={handlePrevYear} className={styles.arrowBtn}>&lt;</button>
                            <button onClick={handleNextYear} className={styles.arrowBtn}>&gt;</button>
                        </div>
                    </div>

                    <MobileYearsPagination
                        totalYears={yearData.length}
                        activeIndex={activeYearIndex}
                        onYearClick={handleYearClick}
                    />

                    <div></div>
                </div>
            )}
        </div>
    );
};

export default HistoricalTimeline;