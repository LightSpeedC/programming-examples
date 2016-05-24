package com.lightspeedworks.file;

public class Objects {
	Object[] objects;

	public Objects(Object... objects) {
		this.objects = objects;
	}

	Objects add(Object... objects) {
		Object[] obj1 = this.objects;
		Object[] obj2 = this.objects = new Object[obj1.length + objects.length];
		for (int i = 0; i < obj1.length; ++i)
			obj2[i] = obj1[i];
		for (int i = 0; i < objects.length; ++i)
			obj2[obj1.length + i] = objects[i];
		return this;
	}
}
