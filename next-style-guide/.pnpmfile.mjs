export const hooks = {
  readPackage(pkg, context) {
    const fields = ["dependencies", "devDependencies", "optionalDependencies"];
    const names = ["x", "y"];

    fields.forEach((field) => {
      names.forEach((name) => {
        if (pkg[field]?.[name]) {
          delete pkg[field][name];
          context.log(JSON.stringify([field, name]));
        }
      });
    });

    return pkg;
  },
};
