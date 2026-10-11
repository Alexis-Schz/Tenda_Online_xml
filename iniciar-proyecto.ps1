$script = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'server.ps1'
& $script
