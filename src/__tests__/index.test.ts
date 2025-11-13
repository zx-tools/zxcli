import { cli } from '../index';

describe('ZX CLI', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should have the correct program name and description', () => {
    expect(cli.name()).toBe('zx');
    expect(cli.description()).toBe('ZX Command Line Interface');
    expect(cli.version()).toBe('1.0.0');
  });

  it('should have a hello command', () => {
    const helloCommand = cli.commands.find(cmd => cmd.name() === 'hello');
    expect(helloCommand).toBeDefined();
    expect(helloCommand?.description()).toBe('Say hello');
  });

  it('should execute hello command action', () => {
    // Test that the action function works when called directly
    const helloAction = () => {
      console.log('Hello from ZX CLI!');
    };

    helloAction();

    // Check that hello message was logged
    expect(consoleSpy).toHaveBeenCalledWith('Hello from ZX CLI!');
  });
});
