{ pkgs }: {
    deps = [
      pkgs.imagemagick
        pkgs.nodejs_20
        pkgs.postgresql_16
    ];
}
