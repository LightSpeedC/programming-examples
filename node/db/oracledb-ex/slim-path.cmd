if not "%~d0" == "O:" (
	subst O: /d
	subst O: %~dp0.
	pushd O:\
)
