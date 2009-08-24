import os, sys

import jsbridge
from jsbridge import global_settings

this_dir = os.path.abspath(os.path.dirname(__file__))

def cli():
    sys.argv.append('--launch')
    global_settings.MOZILLA_PLUGINS.append(os.path.join(this_dir, 'firebug-1.4.2-fx.xpi'))
    global_settings.MOZILLA_PLUGINS.append(os.path.join(this_dir, 'venk'))
    global_settings.MOZILLA_PLUGINS.append(os.path.join(this_dir, 'mytabs/extension'))
    
    jsbridge.cli(shell=False)
    
if __name__ == "__main__":
    cli()
