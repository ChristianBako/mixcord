def checkanswer(corranswers,listans):
	same = 0
	##This loop only executes once because because 
	##it checks for the if stament sees the first cond isnt met, 
		##does the else and immediately returns
	##This is because python seperates it's loops and  shit with indents
	for a in range(20):
		if cooran[a]==listans[a]:
			same = same+1
		if same >=15:
			pass_fail=('You passed!')
		else:
			pass_fail=('sorry you failed')
		return same,pass_fail


def checkanswer(corranswers,listans):
	same = 0
	##this loop does the calcs
	for a in range(20):
		if cooran[a]==listans[a]:
			same = same+1
	##Then it checks after the loop is done
	##Instead of returning a global var to be printed 
	##	you should just do the prints in the function
	##But it doens't really matter it's something that you'll learn later
	if same >=15:
			pass_fail=('You passed!')
		else:
			pass_fail=('sorry you failed')
		return same,pass_fail