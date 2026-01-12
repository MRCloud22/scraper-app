'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import styles from './list.module.css';

interface Appointment {
    date: string;
    time: string;
    treatment: string;
    price: string;
    bookingUrl: string;
    imageUrl: string | null;
}

interface ApiResponse {
    success: boolean;
    appointments: Appointment[];
    lastUpdated?: string;
    error?: string;
}

const ITEMS_PER_PAGE = 6;

function ListContent() {
    const searchParams = useSearchParams();
    const hideTitle = searchParams.get('noTitle') === 'true';
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAppointments = useCallback(async () => {
        try {
            const isExport = process.env.NEXT_PUBLIC_EXPORT === 'true';
            const cacheBuster = `?t=${Date.now()}`;
            let response;

            if (isExport) {
                response = await fetch(`appointments.json${cacheBuster}`, { cache: 'no-store' });
            } else {
                response = await fetch(`api/appointments${cacheBuster}`, { cache: 'no-store' });
                if (!response.ok) {
                    response = await fetch(`appointments.json${cacheBuster}`, { cache: 'no-store' });
                }
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                setError(data.error || 'Fehler beim Laden');
            }
        } catch (err) {
            setError('Verbindung fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Filter out appointments in the past
    const futureAppointments = appointments.filter(apt => {
        try {
            const dateParts = apt.date.match(/(\d{2})\.(\d{2})\./);
            if (!dateParts) return true;

            const day = parseInt(dateParts[1]);
            const month = parseInt(dateParts[2]) - 1;
            const [hours, minutes] = apt.time.split(':').map(Number);

            const aptDate = new Date();
            aptDate.setMonth(month);
            aptDate.setDate(day);
            aptDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            if (month < now.getMonth() - 6) {
                aptDate.setFullYear(now.getFullYear() + 1);
            }

            return aptDate >= now;
        } catch (e) {
            return true;
        }
    });

    // Pagination calculations
    const totalPages = Math.ceil(futureAppointments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleAppointments = futureAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 className="animate-spin" />
                    <p>Lade Termine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {!hideTitle && <h1 className={styles.title}>Eine Auswahl der nächsten freien Termine</h1>}

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.cell}>Datum</div>
                    <div className={styles.cell}>Uhrzeit</div>
                    <div className={styles.cell}>Leistung</div>
                    <div className={styles.cell}>Preis</div>
                    <div className={styles.cell}></div>
                </div>

                {appointments.length === 0 && !error && (
                    <div className={styles.empty}>
                        Aktuell sind keine freien Termine vorhanden.
                    </div>
                )}

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {visibleAppointments.map((apt, index) => (
                    <div key={`${apt.date}-${apt.time}-${index}`} className={styles.row}>
                        <div className={styles.cell}>{apt.date}</div>
                        <div className={styles.cell}>{apt.time}</div>
                        <div className={styles.cell + ' ' + styles.treatment}>{apt.treatment}</div>
                        <div className={styles.cell + ' ' + styles.price}>{apt.price}</div>
                        <div className={styles.action}>
                            <a
                                href={apt.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.bookButton}
                            >
                                Buchen <ChevronRight size={12} />
                            </a>
                        </div>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={styles.pageButton}
                            title="Vorherige Seite"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={styles.pageButton}
                            title="Nächste Seite"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ListPage() {
    return (
        <Suspense fallback={<div className={styles.container}><div className={styles.loading}><Loader2 className="animate-spin" /></div></div>}>
            <ListContent />
        </Suspense>
    );
}
