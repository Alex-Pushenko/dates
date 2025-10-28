import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import gsap from 'gsap';
import styles from './index.module.scss';
import { yearData } from '../../shared/data'

const HistoricalTimeline: React.FC = () => {
    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const [activeThemeIndex, setActiveThemeIndex] = useState(0);
    const [hoveredThemeIndex, setHoveredThemeIndex] = useState<number | null>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const activeDotRef = useRef<HTMLDivElement>(null);
    const hoverNumbersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const startYearRef = useRef<HTMLSpanElement>(null);
    const endYearRef = useRef<HTMLSpanElement>(null);

    const currentYear = yearData[activeYearIndex] || yearData[0];
    const currentTheme = currentYear.themes[activeThemeIndex] || currentYear.themes[0];

    useEffect(() => {
        setActiveThemeIndex(0);
    }, [activeYearIndex]);

    useEffect(() => {
        if (circleRef.current && activeDotRef.current) {
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
    }, [activeThemeIndex]);

    useEffect(() => {
        if (startYearRef.current) {
            const prevYear = yearData[activeYearIndex - 1] || yearData[yearData.length - 1];
            const fromStart = prevYear.yearStart;
            const toStart = currentYear.yearStart;
            gsap.to({}, {
                duration: 0.8,
                onUpdate: function () {
                    if (startYearRef.current) {
                        const progress = this.progress();
                        const value = Math.round(fromStart + (toStart - fromStart) * progress);
                        startYearRef.current.innerText = value.toString();
                    }
                }
            });
        }

        if (endYearRef.current) {
            const prevYear = yearData[activeYearIndex - 1] || yearData[yearData.length - 1];
            const fromEnd = prevYear.yearEnd;
            const toEnd = currentYear.yearEnd;
            gsap.to({}, {
                duration: 0.8,
                onUpdate: function () {
                    if (endYearRef.current) {
                        const progress = this.progress();
                        const value = Math.round(fromEnd + (toEnd - fromEnd) * progress);
                        endYearRef.current.innerText = value.toString();
                    }
                }
            });
        }
    }, [activeYearIndex]);

    const handlePrevYear = () => {
        setActiveYearIndex(prev => (prev > 0 ? prev - 1 : yearData.length - 1));
    };

    const handleNextYear = () => {
        setActiveYearIndex(prev => (prev < yearData.length - 1 ? prev + 1 : 0));
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
                        zIndex: 20
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

            <div className={styles.circleWrapper}>
                <div ref={circleRef} className={styles.rotatingGroup}>
                    <div className={styles.circle}></div>
                    {renderDots()}
                </div>

                <div className={styles.centerLine}></div>
                <div className={styles.horizontalLine}></div>

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

            <div className={styles.navigationBlock}>
                <div className={styles.counter}>
                    {activeYearIndex + 1}/{yearData.length}
                </div>
                <div className={styles.counter_buttons}>
                    <button onClick={handlePrevYear} className={styles.arrowBtn}>&lt;</button>
                    <button onClick={handleNextYear} className={styles.arrowBtn}>&gt;</button>
                </div>
            </div>

            <div className={styles.swiperContainer}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation={true}
                    simulateTouch={true}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
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
            </div>
        </div>
    );
};

export default HistoricalTimeline;