// Mock the console to capture log messages

import { Environment } from '@application/environment';
import { LoggerLevel } from '@application/logger/logger.level';
import { winstonLoggerFactory } from '@application/logger/winston.logger';

const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

beforeEach(() => {
    stdoutSpy.mockClear();
});

describe('logger', () => {
    test('should output JSON format in production environment', () => {
        // Given
        const logger = winstonLoggerFactory(Environment.Production, LoggerLevel.Debug);

        // When
        logger.info('Test message in production');

        // Then
        const loggedMessage = JSON.parse(stdoutSpy.mock.calls[0][0] as string);
        expect(loggedMessage.level).toBe('info');
        expect(loggedMessage.message).toBe('Test message in production');
    });

    test('should output colored text format in development environment', () => {
        // Given
        const logger = winstonLoggerFactory(Environment.Development, LoggerLevel.Debug);

        // When
        logger.info('Test message in development');

        // Then
        const loggedMessage = stdoutSpy.mock.calls[0][0] as string;
        expect(loggedMessage).toMatch(/info/);
        expect(loggedMessage).toMatch(/Test message in development/);
        expect(loggedMessage).toMatch(/\u001b\[.*?m/g); // Detect ANSI color codes
    });
});
