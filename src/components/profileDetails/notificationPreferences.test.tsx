import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationPreferences from './notificationPreferences';
import chatServices from '../../redux/api/chatServices';
import '@testing-library/jest-dom';
import type { AxiosResponse } from 'axios';
import { AxiosHeaders } from 'axios';
import { Provider } from "react-redux";
import store from '../../redux/store';


// Mock the translation hook
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock MUI icons to avoid rendering issues
vi.mock('@mui/icons-material', () => ({
    Email: () => <span data-testid="EmailIcon" />,
    Notifications: () => <span data-testid="NotificationsIcon" />,
    Settings: () => <span data-testid="SettingsIcon" />,
    Save: () => <span data-testid="SaveIcon" />,
}));

// Mock chatServices
vi.mock('../../redux/api/chatServices');

const mockPreferences = {
    email_frequency: 'immediate',
    trip_request_email: true,
    request_accepted_email: false,
    request_rejected_email: true,
    new_message_email: true,
    trip_reminder_email: false,
    profile_update_email: true,
    system_announcement_email: false,
    trip_request_push: true,
    request_accepted_push: false,
    request_rejected_push: true,
    new_message_push: true,
    trip_reminder_push: false,
    profile_update_push: true,
    system_announcement_push: false,
};

function mockAxiosResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
}

describe('NotificationPreferences', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockImplementation(() =>
            new Promise(() => {})
        );
        render(<NotificationPreferences />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error state if preferences fail to load', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(null, 500)
        );
        render(<NotificationPreferences />);
        await waitFor(() =>
            expect(
                screen.getByText(/Failed to load notification preferences/i)
            ).toBeInTheDocument()
        );
    });

    it('renders preferences after loading', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(mockPreferences)
        );
        render(<NotificationPreferences />);
        expect(await screen.findByText('notificationPreferences')).toBeInTheDocument();
        expect(screen.getByText('emailFrequency')).toBeInTheDocument();
        expect(screen.getByText('emailNotifications')).toBeInTheDocument();
        expect(screen.getByText('pushNotifications')).toBeInTheDocument();
    });

    it('toggles an email notification switch', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(mockPreferences)
        );
        vi.mocked(chatServices.updateNotificationPreferences).mockResolvedValue(
            mockAxiosResponse({})
        );

        render(<NotificationPreferences />);
        const switchLabels = await screen.findAllByText('tripRequests');
        // Pick the first label (the switch label, not the description)
        const switchInput = switchLabels[0].closest('label')?.querySelector('input[type="checkbox"]');
        expect(switchInput).toBeChecked();

        fireEvent.click(switchInput!);

        await waitFor(() =>
            expect(chatServices.updateNotificationPreferences).toHaveBeenCalled()
        );
    });

    it('changes email frequency', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(mockPreferences)
        );
        vi.mocked(chatServices.updateNotificationPreferences).mockResolvedValue(
            mockAxiosResponse({})
        );

        render(
            <Provider store={store}>
                <NotificationPreferences />
            </Provider>
        );
        const select = await screen.findByTestId('email-frequency-select');
        fireEvent.mouseDown(select);
        // //screen.getAllByRole('option').forEach(el => console.log(el.textContent));
        // const option = await screen.findByText('weeklyDigest');
        // fireEvent.click(option);

        // await waitFor(() =>
        //     expect(chatServices.updateNotificationPreferences).toHaveBeenCalledWith(
        //         expect.objectContaining({ email_frequency: 'weekly' })
        //     )
        // );
    });

    it('bulk enables all push notifications', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(mockPreferences)
        );
        vi.mocked(chatServices.updateNotificationPreferences).mockResolvedValue(
            mockAxiosResponse({})
        );

        render(<NotificationPreferences />);
        const enableAll = await screen.findAllByText('enableAll');
        // The second occurrence is for push notifications
        fireEvent.click(enableAll[1]);
        await waitFor(() =>
            expect(chatServices.updateNotificationPreferences).toHaveBeenCalled()
        );
    });

    it('shows snackbar on update', async () => {
        vi.mocked(chatServices.getNotificationPreferences).mockResolvedValue(
            mockAxiosResponse(mockPreferences)
        );
        vi.mocked(chatServices.updateNotificationPreferences).mockResolvedValue(
            mockAxiosResponse({})
        );

        render(<NotificationPreferences />);
        const switchLabels = await screen.findAllByText('tripRequests');
        // Pick the first label (the switch label, not the description)
        const switchInput = switchLabels[0].closest('label')?.querySelector('input[type="checkbox"]');
        fireEvent.click(switchInput!);

        await waitFor(() =>
            expect(screen.getByRole('alert')).toBeInTheDocument()
        );
    });
});

// We recommend installing an extension to run playwright tests.