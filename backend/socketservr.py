"""Compatibility shim for environments where `logging.config` imports `socketservr`.

Some Python distributions contain a typo in `logging.config` that imports
`socketservr` instead of the standard `socketserver`. Providing this module keeps
the import working without patching the interpreter itself.
"""

from socketserver import *  # type: ignore # noqa: F401,F403

